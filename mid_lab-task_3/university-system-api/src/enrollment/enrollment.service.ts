import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CourseService } from '../course/course.service.js';
import type { NotificationService } from '../notification/notification.service.js';
import * as notificationServiceModule from '../notification/notification.service.js';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly courseService: CourseService,
    @Inject(forwardRef(() => notificationServiceModule.NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  getEnrollments() {
    return { message: 'All enrollments fetched', data: [] };
  }

  enrollStudent(studentName: string, courseId: string) {
    const course = this.courseService.getCourseById(courseId);
    const notification = this.notificationService.sendNotification(
      studentName,
      `Welcome! Enrolled in course ${courseId}`,
    );
    return {
      message: 'Student enrolled successfully',
      student: studentName,
      course: course,
      notification: notification,
    };
  }
}