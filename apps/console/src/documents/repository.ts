import { database } from "../store";
import {
  documentBucket,
  documentTypes,
  safeFilename,
  validateDocument,
  type ClientDocument,
} from "./files";
const samples = new Map<string, { record: ClientDocument; file: Blob }>();
export function clearDemoDocuments() {
  samples.clear();
}
function storage() {
  if (!database) throw new Error("Connect Supabase before managing documents.");
  return database.storage.from(documentBucket);
}
export async function listDocuments(
  clientId: string,
  demo: boolean,
): Promise<ClientDocument[]> {
  if (demo)
    return [...samples.values()]
      .filter((item) => item.record.path.startsWith(`${clientId}/`))
      .map((item) => item.record);
  const result: ClientDocument[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await storage().list(clientId, {
      limit: 100,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error)
      throw new Error(
        "Could not load documents. Check the storage connection and retry.",
      );
    for (const item of data)
      if (item.id)
        result.push({
          path: `${clientId}/${item.name}`,
          name: item.name.replace(/^[0-9a-f-]{36}_/, ""),
          size: Number(item.metadata?.size || 0),
          type:
            item.metadata?.mimetype ||
            documentTypes[item.name.split(".").at(-1)?.toLowerCase() || ""] ||
            "",
          created: item.created_at || "",
        });
    if (data.length < 100)
      return result.sort((a, b) => b.created.localeCompare(a.created));
  }
}
export async function uploadDocument(
  clientId: string,
  file: File,
  demo: boolean,
): Promise<ClientDocument> {
  const type = await validateDocument(file);
  const name = safeFilename(file.name);
  const record = {
    path: `${clientId}/${crypto.randomUUID()}_${name}`,
    name,
    type,
    size: file.size,
    created: new Date().toISOString(),
  };
  if (demo) {
    samples.set(record.path, { record, file: new Blob([file], { type }) });
    return record;
  }
  const { error } = await storage().upload(record.path, file, {
    contentType: type,
    cacheControl: "0",
    upsert: false,
  });
  if (error)
    throw new Error(
      "Upload failed. Your file was not added. Check the connection and try again.",
    );
  return record;
}
export async function readDocument(
  record: ClientDocument,
  demo: boolean,
): Promise<Blob> {
  if (demo) {
    const entry = samples.get(record.path);
    if (!entry) throw new Error("This sample document is no longer available.");
    return entry.file;
  }
  const { data, error } = await storage().download(record.path);
  if (error || !data)
    throw new Error(
      "Could not open this document. Check the connection and retry.",
    );
  return data;
}
export async function removeDocument(record: ClientDocument, demo: boolean) {
  if (demo) {
    samples.delete(record.path);
    return;
  }
  const { error } = await storage().remove([record.path]);
  if (error) throw new Error("Could not remove this document. Please retry.");
}
