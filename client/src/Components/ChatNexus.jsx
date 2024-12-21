import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import {APPID, SERVERSECRET} from '../constant.mjs';
export default function ChatNexus() {
  const rootRef = useRef(null);
  const { roomID } = useParams();

  useEffect(() => {
    const init = async () => {
      const userID = Math.floor(Math.random() * 10000).toString();
      const userName = "Anonymous";
      const appID = APPID;
      const serverSecret = SERVERSECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: rootRef.current,
        sharedLinks: [{
          name: 'Personal link',
          url: `${window.location.origin}/room/${roomID}`,
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 50,
        layout: "Auto",
        showLayoutButton: true,
      });
    };

    init();
  }, [roomID]);

  return <div ref={rootRef} className="w-screen h-screen" />;
}

