// "use client";

// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile, toBlobURL } from "@ffmpeg/util";
// import { useMemo, useRef, useState } from "react";

// export default function CompressVideo() {
//   const [loaded, setLoaded] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [outputUrl, setOutputUrl] = useState<string | null>(null);
//   const [crf, setCrf] = useState<number>(28);
//   const [preset, setPreset] = useState<string>("veryfast");
//   const [scale, setScale] = useState<string>("original");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const ffmpegRef = useRef(new FFmpeg());
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const messageRef = useRef<HTMLParagraphElement | null>(null);

//   const baseURL = useMemo(
//     () => "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd",
//     []
//   );

//   const load = async () => {
//     setIsLoading(true);
//     const ffmpeg = ffmpegRef.current;
//     ffmpeg.on("log", ({ message }) => {
//       if (messageRef.current) messageRef.current.innerHTML = message;
//     });
//     await ffmpeg.load({
//       coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
//       wasmURL: await toBlobURL(
//         `${baseURL}/ffmpeg-core.wasm`,
//         "application/wasm"
//       ),
//     });
//     setLoaded(true);
//     setIsLoading(false);
//   };

//   const getScaleFilter = () => {
//     switch (scale) {
//       case "1080p":
//         return "scale=-2:1080";
//       case "720p":
//         return "scale=-2:720";
//       case "480p":
//         return "scale=-2:480";
//       default:
//         return "";
//     }
//   };

//   const compress = async () => {
//     if (!selectedFile) return;
//     setIsProcessing(true);
//     setOutputUrl(null);
//     const ffmpeg = ffmpegRef.current;

//     const inputName = `input_${Date.now()}`;
//     const outputName = `output_${Date.now()}.mp4`;
//     await ffmpeg.writeFile(inputName, await fetchFile(selectedFile));

//     const vf = getScaleFilter();
//     const args = [
//       "-i",
//       inputName,
//       "-c:v",
//       "libx264",
//       "-crf",
//       String(crf),
//       "-preset",
//       preset,
//       ...(vf ? ["-vf", vf] : []),
//       "-c:a",
//       "aac",
//       "-b:a",
//       "128k",
//       outputName,
//     ];

//     await ffmpeg.exec(args);
//     const data = (await ffmpeg.readFile(outputName)) as any;
//     const url = URL.createObjectURL(
//       new Blob([data.buffer], { type: "video/mp4" })
//     );
//     setOutputUrl(url);
//     if (videoRef.current) videoRef.current.src = url;
//     setIsProcessing(false);
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 space-y-4">
//       {!loaded ? (
//         <button
//           className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
//           onClick={load}
//           disabled={isLoading}
//         >
//           {isLoading ? "Loading ffmpeg..." : "Load ffmpeg"}
//           {isLoading && (
//             <span className="animate-spin ml-3">
//               <svg
//                 viewBox="0 0 1024 1024"
//                 focusable="false"
//                 data-icon="loading"
//                 width="1em"
//                 height="1em"
//                 fill="currentColor"
//                 aria-hidden="true"
//               >
//                 <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
//               </svg>
//             </span>
//           )}
//         </button>
//       ) : (
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//             />
//             {selectedFile && (
//               <p className="text-sm text-gray-600">
//                 Selected: {selectedFile.name}
//               </p>
//             )}
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <label className="flex flex-col text-sm">
//               <span className="mb-1">CRF (Lower = Better)</span>
//               <input
//                 type="range"
//                 min={18}
//                 max={35}
//                 value={crf}
//                 onChange={(e) => setCrf(Number(e.target.value))}
//               />
//               <span className="mt-1">{crf}</span>
//             </label>

//             <label className="flex flex-col text-sm">
//               <span className="mb-1">Preset</span>
//               <select
//                 className="border rounded px-2 py-1"
//                 value={preset}
//                 onChange={(e) => setPreset(e.target.value)}
//               >
//                 <option value="ultrafast">ultrafast</option>
//                 <option value="superfast">superfast</option>
//                 <option value="veryfast">veryfast</option>
//                 <option value="faster">faster</option>
//                 <option value="fast">fast</option>
//                 <option value="medium">medium</option>
//                 <option value="slow">slow</option>
//                 <option value="slower">slower</option>
//               </select>
//             </label>

//             <label className="flex flex-col text-sm">
//               <span className="mb-1">Resolution</span>
//               <select
//                 className="border rounded px-2 py-1"
//                 value={scale}
//                 onChange={(e) => setScale(e.target.value)}
//               >
//                 <option value="original">Original</option>
//                 <option value="1080p">1080p</option>
//                 <option value="720p">720p</option>
//                 <option value="480p">480p</option>
//               </select>
//             </label>
//           </div>

//           <button
//             onClick={compress}
//             disabled={!selectedFile || isProcessing}
//             className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-2 px-4 rounded"
//           >
//             {isProcessing ? "Compressing..." : "Compress Video"}
//           </button>

//           <p ref={messageRef} className="text-xs text-gray-500"></p>

//           <div className="space-y-2">
//             <video ref={videoRef} controls className="w-full" />
//             {outputUrl && (
//               <a
//                 href={outputUrl}
//                 download="compressed.mp4"
//                 className="inline-block bg-gray-800 text-white px-4 py-2 rounded"
//               >
//                 Download compressed video
//               </a>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
