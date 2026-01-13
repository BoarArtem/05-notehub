import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";

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

    const { data } = useQuery({
        queryKey: ["notes", page, debouncedSearch],
        queryFn: () =>
            fetchNotes({
                page,
                perPage: 12,
                search: debouncedSearch,
            }),
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onChange={handleSearchChange} />

                {data?.totalPages && data.totalPages > 1 && (
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
                )}

                <button className={css.button} onClick={() => setIsModalOpen(true)}>
                    Create note +
                </button>
            </header>

            {data && <NoteList notes={data.notes} />}

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}
