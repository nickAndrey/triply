'use client';

import { DB_TABLES } from '@/app/_constants/db-tables';
import { useRequest } from '@/app/_providers/request-context';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SupabaseJobSubscriber() {
  const supabase = createClient();
  const router = useRouter();
  const request = useRequest();

  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingJob = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: pendingJob } = await supabase
        .from(DB_TABLES.suggestion_jobs)
        .select('id')
        .eq('user_id', userData.user.id)
        .eq('status', 'pending')
        .limit(1)
        .maybeSingle();

      if (pendingJob) {
        setJobId(pendingJob.id);
      }
    };

    fetchPendingJob();
  }, [supabase]);

  useEffect(() => {
    if (!jobId) return;

    request.start();

    const channel = supabase
      .channel('jobs')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: DB_TABLES.suggestion_jobs,
          filter: `id=eq.${jobId}`,
        },
        async (payload) => {
          if (payload.new.status === 'success') {
            request.finish();

            try {
              await supabase
                .from(DB_TABLES.suggestion_jobs)
                .delete()
                .eq('id', payload.new.id);
            } catch (e) {
              console.warn('Job delete failed', e);
            } finally {
              setJobId(null);
              router.refresh();
            }
          }
          if (payload.new.status === 'error') {
            request.fail(
              payload.new.error_message || 'Something went wrong'
            );
            setJobId(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return null;
}
