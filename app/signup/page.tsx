import { redirect } from 'next/navigation';

export default function SignupPage({
  searchParams,
}: {
  searchParams: { invite_token?: string }
}) {
  // If the user has a valid invite token, they could be shown the signup form.
  // For now, we redirect all public traffic to the new Waitlist system.
  if (!searchParams.invite_token) {
    redirect('/waitlist');
  }

  // TODO: Implement secure signup form for approved waitlist users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#060E20]">
      <h1 className="text-2xl font-bold mb-4">Secure Invite Signup</h1>
      <p className="text-white/60">This area is restricted to approved Waitlist members.</p>
    </div>
  );
}
