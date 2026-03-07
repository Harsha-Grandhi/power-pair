import { describe, it, expect } from 'vitest';
import {
  getAllSituations,
  getSituationById,
  searchSituations,
  getCardForSituation,
  getSampleSituations,
} from '@/lib/firstAidService';

describe('firstAidService', () => {
  describe('getAllSituations', () => {
    it('returns all 10 situations', () => {
      const situations = getAllSituations();
      expect(situations.length).toBe(10);
    });

    it('each situation has required fields', () => {
      const situations = getAllSituations();
      for (const s of situations) {
        expect(s.situation_id).toBeDefined();
        expect(s.situation).toBeTruthy();
        expect(s.category).toBeTruthy();
        expect(s.buckets).toBeDefined();
        expect(s.buckets.length).toBe(4);
      }
    });
  });

  describe('getSituationById', () => {
    it('returns correct situation for valid id', () => {
      const s = getSituationById(1);
      expect(s).toBeDefined();
      expect(s!.situation_id).toBe(1);
      expect(s!.situation).toContain('bad day at work');
    });

    it('returns undefined for invalid id', () => {
      expect(getSituationById(999)).toBeUndefined();
    });
  });

  describe('searchSituations', () => {
    it('finds situations matching query', () => {
      const results = searchSituations('work');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].situation.toLowerCase()).toContain('work');
    });

    it('returns empty array for no match', () => {
      const results = searchSituations('xyznonexistent');
      expect(results.length).toBe(0);
    });

    it('returns empty array for empty query', () => {
      expect(searchSituations('')).toEqual([]);
      expect(searchSituations('   ')).toEqual([]);
    });

    it('ignores short words (<=2 chars)', () => {
      const results = searchSituations('is a');
      expect(results.length).toBe(0);
    });

    it('finds situations matching "quiet"', () => {
      const results = searchSituations('quiet');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].situation.toLowerCase()).toContain('quiet');
    });

    it('finds situations matching "anxious"', () => {
      const results = searchSituations('anxious');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getCardForSituation', () => {
    it('returns ED bucket for EDRS archetype', () => {
      const bucket = getCardForSituation(1, 'EDRS');
      expect(bucket).not.toBeNull();
      expect(bucket!.bucket).toBe('ED');
      expect(bucket!.bucket_name).toBe('Expressive + Direct');
    });

    it('returns EA bucket for EARS archetype', () => {
      const bucket = getCardForSituation(1, 'EARS');
      expect(bucket).not.toBeNull();
      expect(bucket!.bucket).toBe('EA');
    });

    it('returns RD bucket for RDPS archetype', () => {
      const bucket = getCardForSituation(1, 'RDPS');
      expect(bucket).not.toBeNull();
      expect(bucket!.bucket).toBe('RD');
    });

    it('returns RA bucket for RAPP archetype', () => {
      const bucket = getCardForSituation(1, 'RAPP');
      expect(bucket).not.toBeNull();
      expect(bucket!.bucket).toBe('RA');
    });

    it('returns first bucket when archetype is null', () => {
      const bucket = getCardForSituation(1, null);
      expect(bucket).not.toBeNull();
      expect(bucket!.bucket).toBe('ED');
    });

    it('returns null for invalid situation id', () => {
      expect(getCardForSituation(999, 'EDRS')).toBeNull();
    });

    it('bucket contains all required content fields', () => {
      const bucket = getCardForSituation(1, 'EDRS');
      expect(bucket).not.toBeNull();
      expect(bucket!.why_this_moment_matters).toBeTruthy();
      expect(bucket!.understanding_feelings).toBeTruthy();
      expect(bucket!.what_they_need).toBeTruthy();
      expect(bucket!.what_to_say).toBeDefined();
      expect(Object.keys(bucket!.what_to_say).length).toBeGreaterThan(0);
      expect(bucket!.what_to_do.length).toBeGreaterThan(0);
      expect(bucket!.small_gesture).toBeTruthy();
      expect(bucket!.what_not_to_do.length).toBeGreaterThan(0);
      expect(bucket!.closing_affirmation).toBeTruthy();
    });

    it('maps all 16 archetype codes to correct buckets', () => {
      const mappings: [string, string][] = [
        ['EDRS', 'ED'], ['EDRP', 'ED'], ['EDPS', 'ED'], ['EDPP', 'ED'],
        ['EARS', 'EA'], ['EARP', 'EA'], ['EAPS', 'EA'], ['EAPP', 'EA'],
        ['RDRS', 'RD'], ['RDRP', 'RD'], ['RDPS', 'RD'], ['RDPP', 'RD'],
        ['RARS', 'RA'], ['RARP', 'RA'], ['RAPS', 'RA'], ['RAPP', 'RA'],
      ];

      for (const [code, expectedBucket] of mappings) {
        const bucket = getCardForSituation(1, code);
        expect(bucket).not.toBeNull();
        expect(bucket!.bucket).toBe(expectedBucket);
      }
    });
  });

  describe('getSampleSituations', () => {
    it('returns first 4 situations', () => {
      const samples = getSampleSituations();
      expect(samples.length).toBe(4);
      expect(samples[0].situation_id).toBe(1);
      expect(samples[3].situation_id).toBe(4);
    });
  });
});
