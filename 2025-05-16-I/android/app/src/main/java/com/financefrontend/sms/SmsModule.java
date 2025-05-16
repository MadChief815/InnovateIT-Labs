package com.financefrontend.sms;

import android.telephony.SmsManager;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SmsModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public SmsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "SmsModule";
    }

    @ReactMethod
    public void sendSms(String phoneNumber, String message, Promise promise) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(phoneNumber, null, message, null, null);
            promise.resolve("SMS sent successfully");
        } catch (Exception e) {
            promise.reject("SMS_FAILED", e.getMessage());
        }
    }
}
