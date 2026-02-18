
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

Deno.serve(async (req) => {
    try {
        const payload = await req.json();
        console.log("Cakto Webhook recebido:", payload);

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const eventType = payload.event;
        const userEmail = payload.customer?.email;
        const userId = payload.customer?.external_id || payload.metadata?.supabase_uid;

        if (!userId && !userEmail) {
            return new Response("Usuário não identificado", { status: 400 });
        }

        let status = 'expired';
        let newEndDate = new Date();

        switch (eventType) {
            case 'payment_approved':
            case 'subscription_paid':
                status = 'active';
                newEndDate = new Date();
                newEndDate.setDate(newEndDate.getDate() + 31);
                break;
            case 'subscription_canceled':
            case 'payment_refunded':
            case 'payment_chargeback':
                status = 'canceled';
                newEndDate = new Date();
                break;
            default:
                return new Response("Evento ignorado", { status: 200 });
        }

        const query = userId
            ? supabaseAdmin.from('profiles').update({
                subscription_status: status,
                subscription_end_date: newEndDate.toISOString()
            }).eq('id', userId)
            : supabaseAdmin.from('profiles').update({
                subscription_status: status,
                subscription_end_date: newEndDate.toISOString()
            }).eq('email', userEmail);

        const { error } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        return new Response("Erro no Webhook", { status: 400 });
    }
});
