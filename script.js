async function run() {
    const urlBase = 'https://portal-sdl-dev.vivas.vn/hieupm';
    let publicKey = 'BEEpnOVYoaVikBR02ra8N7Q_nuVr6TDoilD12ze-TjuMQxzZgHYS76vxVhn7Peba4vTncocKqBegYdlewqCjCto';
    // A service worker must be registered in order to send notifications on iOS
    const registration = await navigator.serviceWorker.register(
      "service-worker.js",
      {
        scope: "./",
      },
    );
  
    const button = document.getElementById("subscribe");
    const buttonSend = document.getElementById("btn-show-notification");
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
      }
      
  
    const areNotificationsGranted = window.Notification.permission === "granted";
    if (areNotificationsGranted) {
      buttonSend.addEventListener("click", async () => {
        let model = {
            content: $("input[name='content']" ).val(),
            icon: $("input[name='icon']" ).val(),
            identify:[$("input[name='identify']" ).val()],
            image: $("input[name='image']" ).val(),
            title: $("input[name='title']" ).val(),
            url: $("input[name='url']" ).val(),
            send_time: parseInt($("input[name='send_time']" ).val()),
            send_type: parseInt($("input[name='send_type']" ).val()),
            subscription: '123',
          }
          let rq = await fetch(`${urlBase}/api/v1/send_notification`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(model)
          })
          let rs = await rq.json();
      });
    } else {
      button.addEventListener("click", async () => {
        // Triggers popup to request access to send notifications
        const result = await window.Notification.requestPermission();
        console.log(result);
  
        // If the user rejects the permission result will be "denied"
        if (result === "granted") {
          const subscription = await registration.pushManager.subscribe({
            // TODO: Replace with your public vapid key
            applicationServerKey: urlBase64ToUint8Array(publicKey),
            userVisibleOnly: true,
          });
          let model = {
            app_id: 0,
            identify: $("input[name='identify']" ).val(),
            public_key: publicKey,
            subscription: JSON.stringify(subscription),
          }
          let rq = await fetch(`${urlBase}/api/v1/set_subscription`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(model)
          })
          let rs = await rq.json();
        }
      });
    }
  }
  
  run();
  