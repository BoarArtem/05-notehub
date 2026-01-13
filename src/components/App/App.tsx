import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import css from "./App.module.css";
import {
    fetchNotes,
    createNote,
    deleteNote,
} from "../../services/noteService";

import NoteList from "../../components/NoteList/NoteList";
import Pagination from "../../components/Pagination/Pagination";
import SearchBox from "../../components/SearchBox/SearchBox";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";

export default function App() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["notes", page, debouncedSearch],
        queryFn: () =>
            fetchNotes({
                page,
                perPage: 12,
                search: debouncedSearch,
            }),
    });

    const createMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            setIsModalOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onChange={setSearch} />
                <Pagination
                    page={page}
                    totalPages={data?.totalPages ?? 0}
                    onPageChange={setPage}
                />
                <button
                    className={css.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            {data && (
                <NoteList
                    notes={data.notes}
                    onDelete={id => deleteMutation.mutate(id)}
                />
            )}

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                        onCancel={() => setIsModalOpen(false)}
                        onSubmit={values =>
                            createMutation.mutate(values)
                        }
                    />
                </Modal>
            )}
        </div>
    );
}
