# window-post-message-proxy

A library used in place of the native window.postMessage which when used on both the sending and receiving windows allow for a nicer asynchronouse promise messaging between the windows.

When sending messages using the proxy, it will apply a unique id to the message, create a deferred object referenced by the id, and pass the message on to the target window.
The target window will also have an instance of the windowPostMessage proxy setup which will send back messages and preserve the unique id.
Then the original sending instance receives the response messag with id, it will look to see if there is matching id in cache and if so resolve the deferred object with the response.

## Installation
```
npm install --save window-post-message-proxy
```

## Basic Usage
```
// Setup
const iframe = document.getElementById("myFrame");
const windowPostMessageProxy = new WindowPostMessageProxy(iframe.contentWindow);

// Send message
const message = {
    key: "Value"
};

windowPostMessageProxy.postMessage(message)
    .then(response => {
        
    });
```

## Advanced Customization

### Customizing how tracking properties are added to the method

By default the windowPostMessage proxy will store the tracking properties as object on the message by known property: `windowPostMesssageProxy`.

This means if you call:
```
const message = {
    key: "Value"
};

windowPostMessageProxy.postMessage(message);
```
The message is actually modified before it's sent to become:
```
{
    windowPostMessageProxy: {
        id: "ebixvvlbwa3tvtjra4i"
    },
    key: "Value"
};
```

If you want to customize how the tracking properties are added to and retreived from the message you can provide it at construction time as an object with two funtions. See the interface below: 
```
export interface IProcessTrackingProperties {
  addTrackingProperties<T>(message: T, trackingProperties: ITrackingProperties): T;
  getTrackingProperties(message: any): ITrackingProperties;
}
```
`addTrackingProperties` takes a message adds the tracking properties object an returns the message.
`getTrackingProperties` takes a message and extracts the tracking properties.


Example:
```
const customProcessTrackingProperties = {
    addTrackingProperties(message, trackingProperties) {
        message.headers = {
            'tracking-id': trackingProperties.id
        };
        
        return message;
    },
    getTrackingProperties(message): ITrackingProperties {
        return {
            id: message.headers['tracking-id']
        };
    }
};
const windowPostMessageProxy = new WindowPostMessageProxy(iframe.contentWindow, customProcessTrackingProperties);
```

### Customizing how messages are detected as error responses.

By default response messages are considered error message if they contain an error property.

You can override this behavior by passing an `isErrorMessage` function at construction time. See interface:
```
export interface IIsErrorMessage {
  (message: any): boolean;
}
```

Example:
```
function isErrorMessage(message: any) {
    return !(200 <= message.status && message.status < 300);
}
```

## Building
```
tsc -p .
```
Or run `Ctrl + Shift + B` when in Code.

## Testing
```
gulp test --debug
```
The `--debug` uses Chrome and single run. This is temporary work around since phantomjs is timing out.
You can also enable watching by adding the `--watch` argument. 

