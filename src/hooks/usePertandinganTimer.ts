import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    usePertandinganStore,
} from "../stores/pertandinganStore";

import {
    updateTimer as updateTimerApi,
} from "../api/turnament/pertandingan/pertandingan";

interface UsePertandinganTimerOptions {
    pertandinganId: number;
    autoSync?: boolean;
    onTimeUp?: () => void;
}

export const usePertandinganTimer = ({
    pertandinganId,
    autoSync = true,
    onTimeUp,
}: UsePertandinganTimerOptions) => {

    const {
        activePertandingan,
        updateActivePertandingan,
    } = usePertandinganStore();

    const initialTime =
        activePertandingan?.sisa_detik ?? 0;

    const [timeLeft, setTimeLeft] =
        useState(initialTime);

    const [running, setRunning] =
        useState(
            activePertandingan?.status ===
                "berlangsung"
        );

    const timeRef =
        useRef(initialTime);

    const previousRoundRef =
        useRef<number | null>(
            activePertandingan?.ronde_aktif ??
                null
        );

    const previousStatusRef =
        useRef(
            activePertandingan?.status
        );

    useEffect(() => {
        timeRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {

        if (!activePertandingan) {
            return;
        }

        const currentRound =
            activePertandingan.ronde_aktif;

        const currentStatus =
            activePertandingan.status;

        const previousRound =
            previousRoundRef.current;

        const previousStatus =
            previousStatusRef.current;

        if (
            previousRound !== null &&
            currentRound !== previousRound
        ) {
            const newTime =
                activePertandingan.sisa_detik ?? 0;

            setTimeLeft(newTime);

            timeRef.current = newTime;

            setRunning(false);
        }

        else if (
            currentStatus === "pause" &&
            previousStatus !== "pause"
        ) {
            const newTime =
                activePertandingan.sisa_detik ?? 0;

            setTimeLeft(newTime);

            timeRef.current = newTime;

            setRunning(false);
        }

        else if (
            currentStatus === "berlangsung"
        ) {
            setRunning(true);
        }

        else if (
            currentStatus === "selesai"
        ) {
            setRunning(false);
        }

        previousRoundRef.current =
            currentRound;

        previousStatusRef.current =
            currentStatus;

    }, [
        activePertandingan?.id,
        activePertandingan?.ronde_aktif,
        activePertandingan?.status,
        activePertandingan?.sisa_detik,
    ]);

    useEffect(() => {

        if (!running) {
            return;
        }

        const interval =
            window.setInterval(() => {

                setTimeLeft((current) => {

                    if (current <= 1) {

                        window.clearInterval(
                            interval
                        );

                        timeRef.current = 0;

                        setRunning(false);

                        onTimeUp?.();

                        return 0;
                    }

                    const next =
                        current - 1;

                    timeRef.current =
                        next;

                    return next;
                });

            }, 1000);

        return () => {
            window.clearInterval(
                interval
            );
        };

    }, [
        running,
        onTimeUp,
    ]);

    const syncTimer =
        useCallback(
            async (value?: number) => {

                const seconds =
                    value ??
                    timeRef.current;

                const result =
                    await updateTimerApi(
                        pertandinganId,
                        {
                            sisa_detik:
                                seconds,
                        }
                    );

                updateActivePertandingan(
                    result
                );

                return result;
            },
            [
                pertandinganId,
                updateActivePertandingan,
            ]
        );

    const setTimer =
        useCallback(
            (seconds: number) => {

                setTimeLeft(
                    seconds
                );

                timeRef.current =
                    seconds;

                updateActivePertandingan({
                    sisa_detik:
                        seconds,
                });
            },
            [
                updateActivePertandingan,
            ]
        );

    const startTimer =
        useCallback(() => {

            setRunning(true);

        }, []);

    const stopTimer =
        useCallback(() => {

            setRunning(false);

        }, []);

    useEffect(() => {

        if (
            !autoSync ||
            !running
        ) {
            return;
        }

        const interval =
            window.setInterval(() => {

                syncTimer()
                    .catch(console.error);

            }, 5000);

        return () => {

            window.clearInterval(
                interval
            );

        };

    }, [
        autoSync,
        running,
        syncTimer,
    ]);

    const formattedTime =
        `${String(
            Math.floor(
                timeLeft / 60
            )
        ).padStart(2, "0")}:${String(
            timeLeft % 60
        ).padStart(2, "0")}`;

    return {
        timeLeft,
        formattedTime,
        running,

        setTimer,
        startTimer,
        stopTimer,

        syncTimer,
    };
};