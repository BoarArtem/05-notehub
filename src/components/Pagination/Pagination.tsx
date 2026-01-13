import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
                                       page,
                                       totalPages,
                                       onPageChange,
                                   }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <ReactPaginate
            pageCount={totalPages}
            onPageChange={({ selected }) =>
                onPageChange(selected + 1)
            }
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            previousLabel="←"
            nextLabel="→"
        />
    );
}
