'use server';

import { db } from '../db/drizzle';
import {
  applications,
  cvs,
  jobPositions,
  candidates,
  type Application,
  type NewApplication,
} from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export interface ApplicationWithDetails extends Application {
  candidate?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
  };
  cv?: {
    id: number;
    fileName: string;
    emailSubject: string | null;
    emailFrom: string | null;
  };
  jobPosition?: {
    id: number;
    title: string;
  };
}

/**
 * Create a new application
 */
export async function createApplication(
  cvId: number,
  jobPositionId: number | null,
  applicationType: 'direct' | 'spontaneous' = 'direct'
): Promise<Application> {
  try {
    const [application] = await db
      .insert(applications)
      .values({
        cvId,
        jobPositionId,
        applicationType,
        status: 'pending',
        appliedAt: new Date(),
      } as NewApplication)
      .returning();

    return application;
  } catch (error) {
    console.error('Error creating application:', error);
    throw new Error('Failed to create application');
  }
}

/**
 * Update application status
 */
export async function updateApplicationStatus(
  applicationId: number,
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'accepted',
  reviewNotes?: string
): Promise<Application> {
  try {
    const [updated] = await db
      .update(applications)
      .set({
        status,
        reviewNotes,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(applications.id, applicationId))
      .returning();

    if (!updated) {
      throw new Error('Application not found');
    }

    return updated;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update application status');
  }
}

/**
 * Get all applications for a specific job position
 */
export async function getApplicationsForPosition(
  jobPositionId: number
): Promise<ApplicationWithDetails[]> {
  try {
    const results = await db
      .select({
        application: applications,
        cv: cvs,
        candidate: candidates,
        jobPosition: jobPositions,
      })
      .from(applications)
      .innerJoin(cvs, eq(applications.cvId, cvs.id))
      .leftJoin(candidates, eq(cvs.candidateId, candidates.id))
      .leftJoin(jobPositions, eq(applications.jobPositionId, jobPositions.id))
      .where(eq(applications.jobPositionId, jobPositionId));

    return results.map((r) => ({
      ...r.application,
      candidate: r.candidate
        ? {
            id: r.candidate.id,
            firstName: r.candidate.firstName,
            lastName: r.candidate.lastName,
            email: r.candidate.email,
            phone: r.candidate.phone,
            location: r.candidate.location,
          }
        : undefined,
      cv: r.cv
        ? {
            id: r.cv.id,
            fileName: r.cv.fileName,
            emailSubject: r.cv.emailSubject,
            emailFrom: r.cv.emailFrom,
          }
        : undefined,
      jobPosition: r.jobPosition
        ? {
            id: r.jobPosition.id,
            title: r.jobPosition.title,
          }
        : undefined,
    }));
  } catch (error) {
    console.error('Error getting applications for position:', error);
    throw new Error('Failed to get applications');
  }
}

/**
 * Get all spontaneous applications (no specific job position)
 */
export async function getSpontaneousApplications(
  teamId: number
): Promise<ApplicationWithDetails[]> {
  try {
    const results = await db
      .select({
        application: applications,
        cv: cvs,
        candidate: candidates,
      })
      .from(applications)
      .innerJoin(cvs, eq(applications.cvId, cvs.id))
      .leftJoin(candidates, eq(cvs.candidateId, candidates.id))
      .where(
        and(
          isNull(applications.jobPositionId),
          eq(cvs.teamId, teamId)
        )
      );

    return results.map((r) => ({
      ...r.application,
      candidate: r.candidate
        ? {
            id: r.candidate.id,
            firstName: r.candidate.firstName,
            lastName: r.candidate.lastName,
            email: r.candidate.email,
            phone: r.candidate.phone,
            location: r.candidate.location,
          }
        : undefined,
      cv: r.cv
        ? {
            id: r.cv.id,
            fileName: r.cv.fileName,
            emailSubject: r.cv.emailSubject,
            emailFrom: r.cv.emailFrom,
          }
        : undefined,
    }));
  } catch (error) {
    console.error('Error getting spontaneous applications:', error);
    throw new Error('Failed to get spontaneous applications');
  }
}

/**
 * Get application for a specific CV
 */
export async function getApplicationForCV(
  cvId: number,
  jobPositionId?: number
): Promise<Application | null> {
  try {
    const query = jobPositionId
      ? and(
          eq(applications.cvId, cvId),
          eq(applications.jobPositionId, jobPositionId)
        )
      : eq(applications.cvId, cvId);

    const [application] = await db
      .select()
      .from(applications)
      .where(query)
      .limit(1);

    return application || null;
  } catch (error) {
    console.error('Error getting application for CV:', error);
    return null;
  }
}

/**
 * Check if CV has applied for a specific position
 */
export async function hasAppliedForPosition(
  cvId: number,
  jobPositionId: number
): Promise<boolean> {
  try {
    const [application] = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.cvId, cvId),
          eq(applications.jobPositionId, jobPositionId)
        )
      )
      .limit(1);

    return !!application;
  } catch (error) {
    console.error('Error checking if CV applied for position:', error);
    return false;
  }
}

/**
 * Get application with full details
 */
export async function getApplicationById(
  applicationId: number
): Promise<ApplicationWithDetails | null> {
  try {
    const [result] = await db
      .select({
        application: applications,
        cv: cvs,
        candidate: candidates,
        jobPosition: jobPositions,
      })
      .from(applications)
      .innerJoin(cvs, eq(applications.cvId, cvs.id))
      .leftJoin(candidates, eq(cvs.candidateId, candidates.id))
      .leftJoin(jobPositions, eq(applications.jobPositionId, jobPositions.id))
      .where(eq(applications.id, applicationId))
      .limit(1);

    if (!result) {
      return null;
    }

    return {
      ...result.application,
      candidate: result.candidate
        ? {
            id: result.candidate.id,
            firstName: result.candidate.firstName,
            lastName: result.candidate.lastName,
            email: result.candidate.email,
            phone: result.candidate.phone,
            location: result.candidate.location,
          }
        : undefined,
      cv: result.cv
        ? {
            id: result.cv.id,
            fileName: result.cv.fileName,
            emailSubject: result.cv.emailSubject,
            emailFrom: result.cv.emailFrom,
          }
        : undefined,
      jobPosition: result.jobPosition
        ? {
            id: result.jobPosition.id,
            title: result.jobPosition.title,
          }
        : undefined,
    };
  } catch (error) {
    console.error('Error getting application by ID:', error);
    return null;
  }
}
