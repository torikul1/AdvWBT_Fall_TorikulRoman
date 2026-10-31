import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { EnrollmentService } from '../enrollment/enrollment.service.js';
import * as enrollmentServiceModule from '../enrollment/enrollment.service.js';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => enrollmentServiceModule.EnrollmentService))
    private readonly enrollmentService: EnrollmentService,
  ) {}

  sendNotification(studentName: string, message: string) {
    return {
      message: 'Notification sent successfully',
      student: studentName,
      notificationMessage: message,
    };
  }

  checkEnrollmentAndNotify(studentName: string, courseId: string) {
    const enrollments = this.enrollmentService.getEnrollments();
    return {
      status: 'Checked and Notified',
      student: studentName,
      courseId: courseId,
      enrollmentData: enrollments,
    };
  }
}