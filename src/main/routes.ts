import fs from 'fs';

import { Application, RequestHandler } from 'express';

import { GetController } from './app/controller/GetController';
import { PostController } from './app/controller/PostController';
import { KeepAliveController } from './app/keepalive/KeepAliveController';
import { StepWithContent, stepsWithContent } from './steps';
import { AccessibilityStatementGetController } from './steps/accessibility-statement/get';
import { ContactUsGetController } from './steps/contact-us/get';
import { PaymentHandler, PaymentValidationHandler } from './steps/edge-case/payments/paymentController';
import { ErrorController } from './steps/error/error.controller';
import { HomeGetController } from './steps/home/get';
import { PrivacyPolicyGetController } from './steps/privacy-policy/get';
import { SaveSignOutGetController } from './steps/save-sign-out/get';
import { TermsAndConditionsGetController } from './steps/terms-and-conditions/get';
import { TimedOutGetController } from './steps/timed-out/get';
import {
  ACCESSIBILITY_STATEMENT,
  CONTACT_US,
  CSRF_TOKEN_ERROR_URL,
  HOME_URL,
  KEEP_ALIVE_URL,
  PAYMENT_GATEWAY_ENTRY_URL,
  PAYMENT_RETURN_URL_CALLBACK,
  PRIVACY_POLICY,
  SAVE_AND_SIGN_OUT,
  SESSION,
  //SELECT_COURT,
  TERMS_AND_CONDITIONS,
  TIMED_OUT_URL,
} from './steps/urls';

export class Routes {
  /**
   *
   * @param app
   */
  public enableFor(app: Application): void {
    const { errorHandler } = app.locals;
    const errorController = new ErrorController();

    app.get(CSRF_TOKEN_ERROR_URL, errorHandler(errorController.CSRFTokenError));
    app.get(HOME_URL, errorHandler(new HomeGetController().get));
    app.get(SAVE_AND_SIGN_OUT, errorHandler(new SaveSignOutGetController().get));
    app.get(TIMED_OUT_URL, errorHandler(new TimedOutGetController().get));
    app.get(PRIVACY_POLICY, errorHandler(new PrivacyPolicyGetController().get));
    app.get(TERMS_AND_CONDITIONS, errorHandler(new TermsAndConditionsGetController().get));
    app.get(ACCESSIBILITY_STATEMENT, errorHandler(new AccessibilityStatementGetController().get));
    app.get(CONTACT_US, errorHandler(new ContactUsGetController().get));
    app.get(SESSION, (req, res) => {
      res.json(req.session);
    });

    for (const step of stepsWithContent) {
      const files = fs.readdirSync(`${step.stepDir}`);

      const getControllerFileName = files.find(item => /get/i.test(item) && !/test/i.test(item));
      const getController = getControllerFileName
        ? require(`${step.stepDir}/${getControllerFileName}`).default
        : GetController;

      if (step && getController) {
        app.get(
          step.url,
          this.routeGuard.bind(this, step, 'get'),
          errorHandler(new getController(step.view, step.generateContent).get)
        );
      }

      if (step.form) {
        const postControllerFileName = files.find(item => /post/i.test(item) && !/test/i.test(item));
        const postController = postControllerFileName
          ? require(`${step.stepDir}/${postControllerFileName}`).default
          : PostController;
        app.post(
          step.url,
          // eslint-disable-next-line prettier/prettier
            this.routeGuard.bind(this, step, 'post'),
          errorHandler(new postController(step.form.fields).post)
        );
      }
    }

    app.get(KEEP_ALIVE_URL, errorHandler(new KeepAliveController().get));

    /**
     * @Payment_Handler
     */
    app.post(PAYMENT_GATEWAY_ENTRY_URL, errorHandler(PaymentHandler));
    app.get(PAYMENT_RETURN_URL_CALLBACK, errorHandler(PaymentValidationHandler));
    /**
     * @POST_ROUTES
     */

    app.use(errorController.notFound as unknown as RequestHandler);
  }

  private routeGuard(step: StepWithContent, httpMethod: string, req, res, next) {
    if (typeof step?.routeGuard?.[httpMethod] === 'function') {
      step.routeGuard[httpMethod].call(this, req, res, next);
    } else {
      next();
    }
  }
}
