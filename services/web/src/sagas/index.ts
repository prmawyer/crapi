/*
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { all, Effect } from "redux-saga/effects";
import { userActionWatcher } from "./userSaga";
import { shopActionWatcher } from "./shopSaga";
import { profileActionWatcher } from "./profileSaga";
import { communityActionWatcher } from "./communitySaga";
import { vehicleActionWatcher } from "./vehicleSaga";
import { mechanicActionWatcher } from "./mechanicSaga";

// --- start traceable captcha ---
const traceableCaptchaSiteKeyForLoginFlow = "{{TRACEABLE_CAPTCHA_SITE_KEY_FOR_LOGIN_FLOW}}";
const traceableCaptchaUrl = "{{TRACEABLE_CAPTCHA_URL}}";

console.log('process.env:', process.env)
console.log('TRACEABLE_CAPTCHA_SITE_KEY_FOR_LOGIN_FLOW:', traceableCaptchaSiteKeyForLoginFlow);
console.log('TRACEABLE_CAPTCHA_URL:', traceableCaptchaUrl);

interface CaptchaConfig {
  sitekey: string;
  captchaContainer: string;
  disableContainer: string;
}

declare global {
  interface Window {
    traceableCaptchaConfig: CaptchaConfig;
  }
}
window.traceableCaptchaConfig = {
    // sitekey: "T-8784729",
    sitekey: traceableCaptchaSiteKeyForLoginFlow,
    captchaContainer: "#basic",
    disableContainer: "#login-button-container"
};
console.log('traceableCaptchaConfig:', window.traceableCaptchaConfig);
console.log("Loading traceable captcha v2..");
document.addEventListener("DOMContentLoaded", function() {
    console.log("Traceable captcha js injection begin..");
    const traceable_service = document.createElement('script');
    traceable_service.async = true;
    // traceable_service.src = 'https://captcha.traceable.ai/traceable/captcha/v3/' + traceableCaptchaConfig.sitekey + '/fp.js';
    traceable_service.src = traceableCaptchaUrl + "/traceable/captcha/v3/" + window.traceableCaptchaConfig.sitekey + "/fp.js";
    (document.head || document.body).appendChild(traceable_service);
    console.log("Appended Traceable scripts.");
});
// --- end traceable captcha ---

/**
 * saga to yield all others
 */
export default function* rootSaga(): Generator<Effect, void, unknown> {
  yield all([
    userActionWatcher(),
    shopActionWatcher(),
    profileActionWatcher(),
    communityActionWatcher(),
    vehicleActionWatcher(),
    mechanicActionWatcher(),
  ]);
}
