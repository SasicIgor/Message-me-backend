export const msgSnippet = (msg: string | null) => {
  if (msg && msg.length > 20) return `${msg.substring(0, 20)}...`;
  return msg;
};
