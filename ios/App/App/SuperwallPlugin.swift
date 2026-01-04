import Foundation
import Capacitor
import SuperwallKit
import Combine

@objc(SuperwallPlugin)
public class SuperwallPlugin: CAPPlugin {
    private var cancellables = Set<AnyCancellable>()

    @objc func register(_ call: CAPPluginCall) {
        guard let event = call.getString("event") else {
            call.reject("Event name is required")
            return
        }
        
        let params = call.getObject("params") as? [String: Any] ?? [:]

        DispatchQueue.main.async {
            Superwall.shared.register(event: event, params: params) { [weak self] state in
                switch state {
                case .presented(let paywallInfo):
                    print("Paywall presented: \(paywallInfo.name)")
                    call.resolve(["result": "presented"])
                case .dismissed(let result):
                    switch result {
                    case .purchased(let productId):
                        print("Purchased: \(productId)")
                        call.resolve(["result": "userIsSubscribed"])
                    case .declined:
                        call.resolve(["result": "noRuleMatch"])
                    case .restored:
                        call.resolve(["result": "userIsSubscribed"])
                    }
                case .skipped(let reason):
                    switch reason {
                    case .userIsSubscribed:
                        call.resolve(["result": "userIsSubscribed"])
                    case .noRuleMatch:
                        call.resolve(["result": "noRuleMatch"])
                    case .eventNotFound:
                        call.resolve(["result": "eventNotFound"])
                    default:
                        call.resolve(["result": "unknown"])
                    }
                }
            }
        }
    }

    @objc func setUserAttributes(_ call: CAPPluginCall) {
        let attributes = call.getObject("attributes") as? [String: Any] ?? [:]
        Superwall.shared.setUserAttributes(attributes)
        call.resolve()
    }

    @objc func restore(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            Superwall.shared.restore { result in
                switch result {
                case .restored:
                    call.resolve(["result": "restored"])
                case .failed(let error):
                    call.reject(error.localizedDescription)
                }
            }
        }
    }
}