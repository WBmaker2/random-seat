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
  if (studentCount <= 0 || groupCount <= 0) return [];
  const validGroups = Math.min(groupCount, studentCount);

  const students = Array.from({ length: studentCount }, (_, i) => i + 1);
  const shuffled = shuffleArray(students);

  const baseCount = Math.floor(studentCount / validGroups);
  const remainder = studentCount % validGroups;

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
