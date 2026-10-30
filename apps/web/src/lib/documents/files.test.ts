import { describe, expect, it } from "vitest";
import { DEFAULT_STORAGE_BUCKET, storageBucketName } from "@shilan/firebase/admin";
import {
  documentStoragePath,
  isAllowedContentType,
  isAllowedSize,
  isStorageSetupError,
  MAX_DOCUMENT_BYTES,
  pathBelongsToUser,
  sanitizeFileName,
} from "./files";

describe("document files", () => {
  it("keeps the shilansite bucket as the default", () => {
    expect(DEFAULT_STORAGE_BUCKET).toBe("shilansite.firebasestorage.app");
    const previous = process.env.FIREBASE_STORAGE_BUCKET;
    delete process.env.FIREBASE_STORAGE_BUCKET;
    expect(storageBucketName()).toBe("shilansite.firebasestorage.app");
    process.env.FIREBASE_STORAGE_BUCKET = " custom.appspot.com ";
    expect(storageBucketName()).toBe("custom.appspot.com");
    if (previous === undefined) delete process.env.FIREBASE_STORAGE_BUCKET;
    else process.env.FIREBASE_STORAGE_BUCKET = previous;
  });

  it("builds a private path under the customer and drops directories", () => {
    expect(documentStoragePath("abc", "11111111-1111-1111-1111-111111111111", "passport.pdf")).toBe(
      "customers/abc/11111111-1111-1111-1111-111111111111-passport.pdf",
    );
    expect(documentStoragePath("abc", "id", "../../etc/passwd")).toBe("customers/abc/id-passwd");
    expect(documentStoragePath("abc", "id", "תיק זהות.jpg")).toBe("customers/abc/id-תיק_זהות.jpg");
    expect(sanitizeFileName("   ")).toBe("file");
    expect(pathBelongsToUser("customers/abc/id-file.pdf", "abc")).toBe(true);
    expect(pathBelongsToUser("customers/other/id-file.pdf", "abc")).toBe(false);
    expect(pathBelongsToUser("customers/abc/../other/file.pdf", "abc")).toBe(false);
  });

  it("accepts images and pdf up to 10MB", () => {
    expect(isAllowedContentType("image/jpeg")).toBe(true);
    expect(isAllowedContentType("image/heic; charset=binary")).toBe(true);
    expect(isAllowedContentType("application/pdf")).toBe(true);
    expect(isAllowedContentType("text/html")).toBe(false);
    expect(isAllowedContentType("application/pdf\ntext/html")).toBe(false);
    expect(isAllowedSize(1)).toBe(true);
    expect(isAllowedSize(MAX_DOCUMENT_BYTES)).toBe(true);
    expect(isAllowedSize(0)).toBe(false);
    expect(isAllowedSize(MAX_DOCUMENT_BYTES + 1)).toBe(false);
    expect(isAllowedSize(1.5)).toBe(false);
  });

  it("recognises a missing bucket or a storage permission error", () => {
    expect(
      isStorageSetupError({ code: 404, message: "The specified bucket does not exist." }),
    ).toBe(true);
    expect(
      isStorageSetupError({ code: 403, message: "Permission 'storage.buckets.get' denied" }),
    ).toBe(true);
    expect(isStorageSetupError({ code: 403, message: "unrelated" })).toBe(false);
    expect(isStorageSetupError(new Error("network down"))).toBe(false);
  });
});
