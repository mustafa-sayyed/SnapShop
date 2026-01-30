import { Container, ProductItem } from "@/components";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { config } from "@/Config/config";
import { useShop } from "@/contexts/ShopContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searching, setSearching] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 30;

  const searchProducts = async () => {
    try {
      setSearching(true);
      const response = await axios.get(`${config.backendUrl}/products`, {
        params: {
          search: searchString,
          page: currentPage,
          limit,
        },
      });
      if (response.data.success) {
        setSearchResults(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.totalProducts);
      }
    } catch (error) {
      console.log("Error while searching Products: ", error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    setSearching(true);

    const searchTimer = setTimeout(() => {
      searchProducts();
    }, 1000);

    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    }
  }, [currentPage, limit, searchString]);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => setCurrentPage(i)}
              className="cursor-pointer"
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Logic to Render Page Numbers
      pages.push(
        <PaginationItem key={0}>
          <PaginationLink
            isActive={currentPage === 0}
            onClick={() => setCurrentPage(0)}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (currentPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => setCurrentPage(i)}
              className="cursor-pointer"
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="cursor-pointer"
          >
            {totalPages + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <Container>
      <div className="min-h-screen w-full">
        <div className="w-full max-w-5xl m-auto my-10">
          <Input
            type="text"
            placeholder="Search what you want..."
            className="border-2 p-5 text-lg"
            onChange={(e) => setSearchString(e.target.value)}
          />

          {searchResults.length ?
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-14">
                {searchResults.map((product) => (
                  <ProductItem
                    key={product._id}
                    id={product._id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    averageRating={product.averageRating}
                    totalRatings={product.totalRatings}
                  />
                ))}
              </div>
              {totalPages > 0 && (
                <div className="mt-16 mb-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            currentPage > 0 && setCurrentPage(currentPage - 1)
                          }
                          className={`cursor-pointer ${currentPage === 0 ? "opacity-50 pointer-events-none" : ""}`}
                        />
                      </PaginationItem>

                      {renderPageNumbers()}

                      <PaginationItem>
                        <PaginationNext
                          className={`cursor-pointer ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
                          onClick={() => {
                            console.log(
                              "Next BTN CLICKED",
                              currentPage,
                              totalPages,
                              currentPage < totalProducts,
                            );
                            currentPage < totalPages && setCurrentPage(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          : <div className="w-full text-xl flex justify-center text-center min-h-screen mt-10 ">
              {searching ?
                <div className="flex items-center gap-2">
                  <Spinner className={"size-5"} />
                  <span>Searching Products...</span>
                </div>
              : <span>No Products Found</span>}
            </div>
          }
        </div>
      </div>
    </Container>
  );
}

export default Search;
