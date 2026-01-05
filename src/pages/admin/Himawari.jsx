import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const BASE_URL =
  "https://www.data.jma.go.jp/mscweb/data/himawari/img/r2w/r2w_snd_";

const getTimestamps = () => {
  const now = dayjs().utc().startOf("minute");
  const timestamps = [];
  let current = now.minute(Math.floor(now.minute() / 10) * 10).second(0);

  for (let i = 0; i < 24 * 6; i++) {
    timestamps.unshift(current.format("HHmm"));
    current = current.subtract(10, "minute");
  }
  return timestamps;
};

const Himawari = () => {
  const [loading, setLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const framesRef = useRef([]);

  useEffect(() => {
    const timestamps = getTimestamps();
    const urls = timestamps.map((ts) => `${BASE_URL}${ts}.jpg`);
    framesRef.current = urls;

    let loaded = 0;
    urls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === urls.length) setLoading(false);
      };
    });
  }, []);

  useEffect(() => {
    if (framesRef.current.length === 0) return;
    const interval = setInterval(() => {
      setCurrentFrame((f) => (f + 1) % framesRef.current.length);
    }, 100); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full h-full items-end justify-end">
      <div className="flex h-[calc(100vh-64px)] overflow-hidden relative w-full justify-end bg-black">
        {loading ? (
          <span className="text-white">Loading…</span>
        ) : (
          <img
            src={framesRef.current[currentFrame]}
            alt={`Himawari ${currentFrame}`}
            className="object-cover object-top w-full h-full scale-140 translate-y-10"
          />
        )}
      </div>
    </div>
  );
};

export default Himawari;
