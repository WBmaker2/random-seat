import { describe, it, expect } from 'vitest';
import { generateSeatingPlan, shuffleArray, getPlaceholderGroups } from './seating';

describe('seating utility', () => {
  describe('shuffleArray', () => {
    it('creates a copy without modifying the original array and retains all elements', () => {
      const input = [1, 2, 3, 4, 5];
      const originalCopy = [...input];
      const shuffled = shuffleArray(input);

      expect(shuffled).toHaveLength(5);
      expect([...shuffled].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
      expect(input).toEqual(originalCopy);
      expect(shuffled).not.toBe(input);
    });

    it('handles empty array', () => {
      const input: number[] = [];
      const shuffled = shuffleArray(input);
      expect(shuffled).toEqual([]);
      expect(shuffled).not.toBe(input);
    });
  });

  describe('generateSeatingPlan', () => {
    it('distributes 24 students into 6 groups evenly (4 students each)', () => {
      const plan = generateSeatingPlan(24, 6);
      expect(plan).toHaveLength(6);

      plan.forEach((group, idx) => {
        expect(group.groupIndex).toBe(idx);
        expect(group.groupName).toBe(`${idx + 1}모둠`);
        expect(group.seatNumbers).toHaveLength(4);
      });

      const allSeats = plan.flatMap((g) => g.seatNumbers).sort((a, b) => a - b);
      expect(allSeats).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
    });

    it('distributes 25 students into 6 groups fairly (5, 4, 4, 4, 4, 4)', () => {
      const plan = generateSeatingPlan(25, 6);
      expect(plan).toHaveLength(6);
      expect(plan[0].seatNumbers).toHaveLength(5);

      for (let i = 1; i < 6; i++) {
        expect(plan[i].seatNumbers).toHaveLength(4);
      }

      const allSeats = plan.flatMap((g) => g.seatNumbers).sort((a, b) => a - b);
      expect(allSeats).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    });

    it('distributes 26 students into 6 groups fairly with multiple remainders (5, 5, 4, 4, 4, 4)', () => {
      const plan = generateSeatingPlan(26, 6);
      expect(plan).toHaveLength(6);
      expect(plan[0].seatNumbers).toHaveLength(5);
      expect(plan[1].seatNumbers).toHaveLength(5);
      for (let i = 2; i < 6; i++) {
        expect(plan[i].seatNumbers).toHaveLength(4);
      }
      const allSeats = plan.flatMap((g) => g.seatNumbers).sort((a, b) => a - b);
      expect(allSeats).toEqual(Array.from({ length: 26 }, (_, i) => i + 1));
    });

    it('handles edge cases gracefully', () => {
      // 0 or negative students / groups return empty array
      expect(generateSeatingPlan(0, 5)).toEqual([]);
      expect(generateSeatingPlan(-3, 5)).toEqual([]);
      expect(generateSeatingPlan(5, 0)).toEqual([]);
      expect(generateSeatingPlan(5, -2)).toEqual([]);
      expect(generateSeatingPlan(-1, -1)).toEqual([]);

      // studentCount < groupCount creates studentCount groups with 1 each
      const smallPlan = generateSeatingPlan(3, 5);
      expect(smallPlan).toHaveLength(3);
      smallPlan.forEach((group, idx) => {
        expect(group.groupIndex).toBe(idx);
        expect(group.groupName).toBe(`${idx + 1}모둠`);
        expect(group.seatNumbers).toHaveLength(1);
      });
      const smallSeats = smallPlan.flatMap((g) => g.seatNumbers).sort((a, b) => a - b);
      expect(smallSeats).toEqual([1, 2, 3]);
    });
  });

  describe('getPlaceholderGroups', () => {
    it('generates placeholder groups with 0 filled seats', () => {
      const placeholders = getPlaceholderGroups(24, 6);
      expect(placeholders).toHaveLength(6);
      placeholders.forEach((p, idx) => {
        expect(p.groupName).toBe(`${idx + 1}모둠`);
        expect(p.seatNumbers).toEqual([0, 0, 0, 0]);
      });
    });

    it('handles non-finite or invalid numbers safely', () => {
      expect(getPlaceholderGroups(NaN, 6)).toEqual([]);
      expect(getPlaceholderGroups(24, NaN)).toEqual([]);
      expect(getPlaceholderGroups(0, 5)).toEqual([]);
    });
  });
});

