import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  course_interest?: string;
}

export const useContact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitInquiry = async (formData: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Insert inquiry into database
      const { error } = await supabase
        .from('inquiries')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          course_interest: formData.course_interest,
          status: 'new'
        });

      if (error) throw error;

      // Send email notifications to customer and admin
      try {
        const { error: notificationError } = await supabase.functions.invoke('send-inquiry-notification', {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            course_interest: formData.course_interest
          }
        });

        if (notificationError) {
          console.error('Error sending notification emails:', notificationError);
          // Don't fail the whole operation if email fails
        }
      } catch (emailError) {
        console.error('Error invoking notification function:', emailError);
        // Don't fail the whole operation if email fails
      }

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours. Check your email for confirmation.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitInquiry,
    isSubmitting
  };
};

