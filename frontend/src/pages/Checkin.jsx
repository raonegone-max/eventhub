import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { Html5Qrcode } from "html5-qrcode"
import { checkInAttendee, getEventById } from "../api/axios"
import { ArrowLeft, ScanLine, CheckCircle2, XCircle, Camera } from "lucide-react"

export default function CheckIn() {
    const { id } = useParams()
    const [event, setEvent] = useState(null)
    const [scanning, setScanning] = useState(false)
    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const scannerRef = useRef(null)
    const containerId = "qr-scanner-region"

    useEffect(() => {
        async function loadEvent() {
            const data = await getEventById(id)
            if (data && data.event) {
                setEvent(data.event)
            }
        }
        loadEvent()

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {})
            }
        }
    }, [id])

    async function startScanning() {
        setResult(null)
        setScanning(true)

        const scanner = new Html5Qrcode(containerId)
        scannerRef.current = scanner

        try {
            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                async (decodedText) => {
                    await scanner.pause(true)
                    await handleScanResult(decodedText)
                },
                () => {}
            )
        } catch (err) {
            setResult({ success: false, message: "Couldn't access the camera. Check permissions." })
            setScanning(false)
        }
    }

    async function stopScanning() {
        if (scannerRef.current) {
            await scannerRef.current.stop().catch(() => {})
            scannerRef.current.clear()
        }
        setScanning(false)
    }

    async function handleScanResult(rsvpId) {
        setProcessing(true)
        const data = await checkInAttendee(rsvpId)

        if (data && data.attendee) {
            setResult({ success: true, message: data.message })
        } else {
            setResult({ success: false, message: data?.message || "Check-in failed." })
        }

        setProcessing(false)
    }

    async function scanNext() {
        setResult(null)
        if (scannerRef.current) {
            await scannerRef.current.resume()
        }
    }

    return (
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 md:py-16">
            <Link
                to={`/events/${id}`}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Event</span>
            </Link>

            <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono mb-3">
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>DOOR CHECK-IN</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white font-sans">Scan Attendee Pass</h1>
                {event && <p className="text-slate-400 text-sm mt-1">{event.title}</p>}
            </div>

            <div className="mt-8 bg-[#0c101a]/80 border border-white/10 rounded-3xl p-6 space-y-4 neon-glow-blue">
                <div id={containerId} className="rounded-2xl overflow-hidden bg-black" />

                {!scanning && !result && (
                    <button
                        onClick={startScanning}
                        className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                        <Camera className="w-5 h-5" />
                        <span>Start Scanning</span>
                    </button>
                )}

                {scanning && !result && !processing && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-2">
                        <ScanLine className="w-4 h-4 animate-pulse text-amber-400" />
                        <span>Point the camera at an attendee's pass</span>
                    </div>
                )}

                {processing && (
                    <p className="text-center text-sm text-slate-400 py-2">Verifying pass…</p>
                )}

                {result && (
                    <div className={`p-5 rounded-2xl text-center space-y-3 border ${
                        result.success
                            ? "bg-emerald-950/60 border-emerald-800"
                            : "bg-rose-950/60 border-rose-800"
                    }`}>
                        {result.success ? (
                            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                        ) : (
                            <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
                        )}
                        <p className={`text-sm font-medium ${result.success ? "text-emerald-300" : "text-rose-300"}`}>
                            {result.message}
                        </p>
                        <button
                            onClick={scanNext}
                            className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition cursor-pointer"
                        >
                            Scan Next Attendee
                        </button>
                    </div>
                )}

                {scanning && (
                    <button
                        onClick={stopScanning}
                        className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition cursor-pointer"
                    >
                        Stop Scanning
                    </button>
                )}
            </div>
        </div>
    )
}