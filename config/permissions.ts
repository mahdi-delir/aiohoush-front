export const PERMISSIONS = {
  course: {
    view:
      'course.view_course',

    add:
      'course.add_course',

    change:
      'course.change_course',

    delete:
      'course.delete_course',
  },

  order: {
    view:
      'order.view_order',

    add:
      'order.add_order',

    change:
      'order.change_order',

    delete:
      'order.delete_order',
  },

  payment: {
    view:
      'accounting.view_payment',

    add:
      'accounting.add_payment',

    change:
      'accounting.change_payment',

    delete:
      'accounting.delete_payment',
  },

  user: {
    view:
      'user.view_user',

    change:
      'user.change_user',
  },
} as const