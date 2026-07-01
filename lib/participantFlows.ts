export type ParticipantFlow = "event" | "crp" | "book" | "lock";

export const PARTICIPANT_FLOW_CONFIG: Record<
  ParticipantFlow,
  { materialsPath: string; label: string }
> = {
  event: {
    materialsPath: "/reju-event-materials",
    label: "REJU Rejuvenation Event™",
  },
  crp: {
    materialsPath: "/reju-event-materials",
    label: "CRP Certification",
  },
  book: {
    materialsPath: "/reju-event-materials",
    label: "Kat's Legacy Book",
  },
  lock: {
    materialsPath: "/reju-event-materials",
    label: "REJU Lock Program Access",
  },
};

export function parseParticipantFlow(value: string | null): ParticipantFlow {
  if (value === "crp" || value === "book" || value === "lock") return value;
  return "event";
}

export function materialsUrl(flow: ParticipantFlow, participantId: string) {
  const base = PARTICIPANT_FLOW_CONFIG[flow].materialsPath;
  const params = new URLSearchParams({ pid: participantId, flow });
  return `${base}?${params.toString()}`;
}

export const PARTICIPANT_ID_STORAGE_KEY = "rejuParticipantId";