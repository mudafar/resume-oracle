import { ProfileSection } from "@/store/slices/profileSectionsSlice";

// Export sections to JSON and trigger download
export function exportSectionsToJson(sections: ProfileSection[], filename = "profile_sections.json") {
  const dataStr = JSON.stringify(sections, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

// Import sections from a JSON file
export function importSectionsFromJson(file: File): Promise<ProfileSection[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result as string;
        const parsed = JSON.parse(result);
        if (!Array.isArray(parsed)) throw new Error("Invalid format: not an array");
        // Basic validation: check required fields
        const valid = parsed.every(
          (s) => typeof s.id === "string" && typeof s.type === "string" && typeof s.content === "string"
        );
        if (!valid) throw new Error("Invalid format: missing fields");
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
} 