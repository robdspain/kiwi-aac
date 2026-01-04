#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(SuperwallPlugin, "Superwall",
           CAP_PLUGIN_METHOD(register, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserAttributes, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(restore, CAPPluginReturnPromise);
)
