// import AgoraUIKit, { PropsInterface,layout } from 'agora-video-uikit-react'
// import AgoraUIKit, { PropsInterface,layout } from 'agora-react-uikit'
// import AgoraUIKit,{ PropsInterface,layout, PropsContext, GridVideo, LocalControls, RtcConfigure, TracksConfigure, RtmConfigure, RemoteMutePopUp, LocalUserContext } from 'agora-react-uikit'
import AgoraUIKit, { PropsInterface, layout, PropsContext, LocalControls, RtcConfigure, TracksConfigure, RtmConfigure, RemoteMutePopUp, LocalUserContext, PinnedVideo } from 'agora-video-uikit-react'

// import {AgoraRTCError}  from "agora-rtc-react"
import AgoraRTC from "agora-rtc-sdk-ng";
import React, { useState, MutableRefObject, useRef, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import "agora-video-uikit-react/dist/index.css"
import "./AgoraVideoMeet.css";
import VirtualBackground from './VirtualBackground';


interface User {
  [key: string]: any;
}

interface RtmProps {
  username: string;
  displayUsername: boolean;
  uid: string;
}

function AgoraVideoMeet() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const data = query.get("data");
  const user: User = data ? JSON.parse(decodeURIComponent(data)) : {};
  const [videoCall, setVideoCall] = useState<boolean>(true);
  const contentRef: MutableRefObject<HTMLDivElement | null> = useRef(null);


  const props: PropsInterface = {
    rtmProps: {
      username: "Gyan++++++++",
      displayUsername: true
    },
    rtcProps: {
      appId: '69b99489462c45cc81ce281cba1ce58c',
      channel: 'appointment_4300',
      token: null,
      layout: layout.grid,
      enableScreensharing: true,
      // role: isHost ? 'host' : 'audience',
      // layout: isPinned ? layout.pin : layout.grid,
    },
    styleProps: {
      localBtnStyles: {
        muteLocalAudio: {
          borderRadius: "50%"
        },
        switchCamera: {
          backgroundColor: "green",
          borderRadius: "50%"
        },
        normalScreen: {
          backgroundColor: "red"
        },
        endCall: {
          backgroundColor: "black"
        }
      },
      maxViewStyles: {
        //View container of side grid view video
        borderWidth: 2,
        backgroundColor: "skyblue",
        borderRadius: "10px"
      },
      UIKitContainer: {
        backgroundColor: "black",
        padding: "10px 0"
      },
      maxViewContainer: {
        color: "red",
      },
      minViewContainer: {
        //Main container of side grid view video
        // backgroundColor: "rgba(0, 0, 0, 0.5)"
        backgroundColor: "green",
        borderRadius: "20px",


      },
      minViewStyles: {
        borderWidth: 1,
        height: "auto",
        width: "auto",
      },
      localBtnContainer: {
        backgroundColor: "black",
        justifyContent: "center"
      },
      showSwapUser: true,
      usernameText: {
        textAlign: "center",
        color: "red",
        backgroundColor: "white",
        marginRight: "5px",
        marginBlock: "10px",
        borderRadius: "5px",
      },
      gridVideoContainer: {
        backgroundColor: "red"
      },
      pinnedVideoContainer: {
        padding: "10px 50px",
        gap: "52px"
      }
    }
  }


  const showConfirmationPopup = useCallback((): boolean => {
    return window.confirm("Are you sure you want to end the call?");
  }, []);

  const handleEndCall = () => {
    if (showConfirmationPopup()) {
      window.location.href = "https://dawi.mykuwaitnet.net/en/dashboard/booking/";
      setVideoCall(false);
    }
  };


  const handleScreenShareError = (error: any) => {
    if (error.message.includes('permission denied') || error.message.includes('NotAllowedError')) {
      alert('Screen sharing was denied. Please allow permissions and try again.');
    } else {
      console.error('Screen sharing error:', error);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: "1080p", // Example configuration
      }, "auto"); // Use "enable" if you want to ensure audio is shared
  
      // Handle the screen track further as per your application logic
      console.log('Screen sharing started', screenTrack);
    } catch (error: any) {
      handleScreenShareError(error);
    }
  };

  const callbacks = {
    EndCall: handleEndCall,
    // "leave-channel": () => {
    //   console.log("Channel left");
    //   // Handle any post-leave logic here
    // },
    // ['live-streaming-error']: (url: string, err: any) => {
    //   console.log("Channel left")
    // },
  };


  useEffect(() => {
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const elements = document.getElementsByClassName("_3Sxu7");
          const elementArray = Array.from(elements); // Convert HTMLCollection to Array
          elementArray.forEach(element => {
            if (element instanceof HTMLElement) {
              if (element.innerHTML) {
                element.style.display = "flex";
              } else {
                element.style.display = "none";
              }
            }
          })
        }
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true });
    }
    return () => {
      observer.disconnect();
    };
  }, []);


  return (
    videoCall ? (
      <div
        ref={contentRef}
        className="custom-agora-container"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh"
        }}
      >
        <PropsContext.Provider value={{
          rtcProps: props.rtcProps,
          callbacks: callbacks,
          rtmProps: props.rtmProps,
          styleProps: props.styleProps
        }}>
          <TracksConfigure>
            <RtcConfigure>
              <LocalUserContext>
                <RtmConfigure>
                  <VirtualBackground />
                  <RemoteMutePopUp />
                  <PinnedVideo />
                  <LocalControls />
                </RtmConfigure>
              </LocalUserContext>
            </RtcConfigure>
          </TracksConfigure>
        </PropsContext.Provider>
        {/* <AgoraUIKit
          rtcProps={props.rtcProps}
          styleProps={props.styleProps}
          rtmProps={props.rtmProps}
          callbacks={callbacks}
        /> */}
      </div>
    ) : null
  );

}

export default AgoraVideoMeet;