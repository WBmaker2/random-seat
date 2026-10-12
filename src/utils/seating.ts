export interface PodSeatGroup {
  groupIndex: number; // 0-based
  groupName: string; // "1모둠", "2모둠"
  seatNumbers: number[]; // e.g. [14, 2, 8, 21]
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateSeatingPlan(studentCount: number, groupCount: number): PodSeatGroup[] {
  const totalStudents = Math.floor(studentCount);
  const totalGroups = Math.floor(groupCount);
  if (totalStudents <= 0 || totalGroups <= 0) return [];
  const validGroups = Math.min(totalGroups, totalStudents);

  const students = Array.from({ length: totalStudents }, (_, i) => i + 1);
  const shuffled = shuffleArray(students);

  const baseCount = Math.floor(totalStudents / validGroups);
  const remainder = totalStudents % validGroups;

  const result: PodSeatGroup[] = [];
  let currentIndex = 0;

  for (let g = 0; g < validGroups; g++) {
    const size = g < remainder ? baseCount + 1 : baseCount;
    const groupSeats = shuffled.slice(currentIndex, currentIndex + size);
    currentIndex += size;

    result.push({
      groupIndex: g,
      groupName: `${g + 1}모둠`,
      seatNumbers: groupSeats,
    });
  }

  return result;
}

/**
 * Generates placeholder groups for the idle / pre-roll state,
 * with empty seats (0) so students and teachers can preview the layout.
 */
export function getPlaceholderGroups(studentCount: number, groupCount: number): PodSeatGroup[] {
  const totalStudents = Math.floor(studentCount);
  const totalGroups = Math.floor(groupCount);
  if (!Number.isFinite(totalStudents) || !Number.isFinite(totalGroups) || totalStudents <= 0 || totalGroups <= 0) {
    return [];
  }
  const validGroups = Math.min(totalGroups, totalStudents);

  const baseCount = Math.floor(totalStudents / validGroups);
  const remainder = totalStudents % validGroups;

  const result: PodSeatGroup[] = [];
  for (let g = 0; g < validGroups; g++) {
    const size = g < remainder ? baseCount + 1 : baseCount;
    result.push({
      groupIndex: g,
      groupName: `${g + 1}모둠`,
      seatNumbers: Array(size).fill(0),
    });
  }

  return result;
}

