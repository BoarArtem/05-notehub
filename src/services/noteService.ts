import axios, {type AxiosResponse } from "axios";
import type { Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
});

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

interface FetchNotesParams {
    page: number;
    perPage: number;
    search?: string;
}

export const fetchNotes = async ({
                                     page,
                                     perPage,
                                     search,
                                 }: FetchNotesParams): Promise<FetchNotesResponse> => {
    const response: AxiosResponse<FetchNotesResponse> =
        await axiosInstance.get("", {
            params: { page, perPage, search },
        });

    return response.data;
};

export const createNote = async (
    note: Omit<Note, "id" | "createdAt">
): Promise<Note> => {
    const response: AxiosResponse<Note> =
        await axiosInstance.post("", note);
    return response.data;
};

export const deleteNote = async (
    id: string
): Promise<Note> => {
    const response: AxiosResponse<Note> =
        await axiosInstance.delete(`/${id}`);
    return response.data;
};
