const log = require('blue-ox')('app:volunteer');
const Router = require('koa-router');
const _ = require('lodash');
const service = require('./service');

var router = new Router();

router.post('/api/volunteer', async (ctx, next) => {
  var attributes = ctx.request.body;
  attributes.userId = attributes.userId || ctx.state.user.id;
  await service.addVolunteer(attributes, function (err, volunteer) {
    if (err) {
      ctx.body = null;
    }
    if (volunteer.silent != 'true') {
      try {
        service.sendAddedVolunteerNotification(ctx.req.user, volunteer, 'volunteer.create.thanks');
      } finally {
        ctx.body = volunteer;
      }
    }
    ctx.body = volunteer;
  });
});

router.delete('/api/volunteer/:id', async (ctx, next) => {
  await service.deleteVolunteer(ctx.params.id, function (notificationInfo, err) {
    if (!err) {
      service.sendDeletedVolunteerNotification(notificationInfo[0], 'volunteer.destroy.decline');
    }
  });
});

module.exports = router.routes();