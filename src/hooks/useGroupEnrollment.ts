import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface GroupMemberInput {
  member_name: string;
  member_email: string;
  member_phone: string;
}

export interface CreateGroupEnrollmentInput {
  course_id: string;
  course_title: string;
  group_name: string;
  /** amounts in paise */
  total_amount: number;
  discount_amount: number;
  coupon_applied?: string | null;
  members: GroupMemberInput[];
}

/** Splits a total (paise) into n shares as equally as possible (1–3 members). */
export const splitEvenly = (total: number, count: number): number[] => {
  const n = Math.min(Math.max(count, 1), 3);
  const base = Math.floor(total / n);
  const remainder = total - base * n;
  return Array.from({ length: n }, (_, i) => (i === 0 ? base + remainder : base));
};

const generateGroupCode = () =>
  `BMM-GRP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const useCreateGroupEnrollment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGroupEnrollmentInput) => {
      if (!user) throw new Error('You must be signed in to create a group enrollment.');
      const memberCount = input.members.length;
      if (memberCount < 1 || memberCount > 3)
        throw new Error('A batch can have 1 to 3 members (solo, 2, or 3).');

      const payable = Math.max(0, input.total_amount - input.discount_amount);
      const shares = splitEvenly(payable, memberCount);
      const groupCode = generateGroupCode();

      const { data: group, error: groupError } = await supabase
        .from('group_enrollments')
        .insert({
          created_by: user.id,
          course_id: input.course_id,
          group_name: input.group_name,
          group_code: groupCode,
          total_amount: input.total_amount,
          discount_amount: input.discount_amount,
          per_member_amount: shares[shares.length - 1],
          coupon_applied: input.coupon_applied || null,
          member_count: memberCount,
          status: 'pending',
        })
        .select()
        .single();

      if (groupError) throw groupError;

      const { error: membersError } = await supabase.from('group_enrollment_members').insert(
        input.members.map((m, i) => ({
          group_id: group.id,
          member_name: m.member_name,
          member_email: m.member_email.toLowerCase(),
          member_phone: m.member_phone,
          share_amount: shares[i],
          is_lead: i === 0,
        }))
      );

      if (membersError) throw membersError;

      // Lead member's own order, linked to the batch
      const lead = input.members[0];
      const orderId = `BMM-GRP-${Date.now()}`;
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        course_id: input.course_id,
        order_id: orderId,
        amount: shares[0],
        student_name: lead.member_name,
        student_email: lead.member_email.toLowerCase(),
        student_phone: lead.member_phone,
        coupon_applied: input.coupon_applied || null,
        discount_amount: input.discount_amount,
        group_enrollment_id: group.id,
      });

      if (orderError) throw orderError;

      // Invoice / confirmation emails for every member + admins (non-blocking)
      await Promise.allSettled(
        input.members.map((m, i) =>
          supabase.functions.invoke('send-order-confirmation', {
            body: {
              orderId: `${orderId}-${i + 1}`,
              customerEmail: m.member_email.toLowerCase(),
              customerName: m.member_name,
              customerPhone: m.member_phone,
              courseName: `${input.course_title} (${memberCount > 1 ? `Batch of ${memberCount}` : 'Solo enrollment'} — ${groupCode})`,
              orderAmount: Math.round(input.total_amount / memberCount),
              discountAmount: Math.round(input.discount_amount / memberCount),
              couponApplied: input.coupon_applied || undefined,
            },
          })
        )
      );

      return { group, groupCode, shares };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['group-enrollments'] });
    },
  });
};

export const useMyGroupEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['group-enrollments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_enrollments')
        .select('*, courses ( title ), group_enrollment_members ( * )')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
