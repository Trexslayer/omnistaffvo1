"use client";
import Link from "next/link";
import { useState } from "react";
export default function InviteAcceptance({token}:{token:string}){const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [done,setDone]=useState(false);
 async function accept(){setBusy(true);setError("");try{const r=await fetch("/api/company/invitations/accept",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token})});const j=await r.json();if(!r.ok)throw new Error(j.error??"Could not accept invitation");setDone(true);window.location.href="/dashboard"}catch(e){setError(e instanceof Error?e.message:"Could not accept invitation")}finally{setBusy(false)}}
 if(!token)return <p className="mt-5 text-sm text-red-700">Invitation token is missing. Open the full link from your invitation email.</p>;
 return <div className="mt-6 space-y-4">{!done&&<><Link href={`/signin?callbackUrl=${encodeURIComponent(`/invite/accept?token=${token}`)}`} className="inline-block rounded-lg border px-4 py-2 text-sm font-medium">Sign in first</Link><button onClick={accept} disabled={busy} className="block w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{busy?"Accepting…":"Accept invitation"}</button></>}{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}</div>
}
