import React, { useState, useEffect } from "react";
import { Container, ProductItem, Title } from "../components";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { config } from "@/Config/config";

function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 30;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.backendUrl}/products`, {
          params: {
            page: currentPage,
            limit: limit,
          },
        });

        if (response.data.success) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
          setTotalProducts(response.data.totalProducts);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      pages.push(
        <PaginationItem key={0}>
          <PaginationLink
            isActive={currentPage === 0}
            onClick={() => handlePageChange(0)}
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
              onClick={() => handlePageChange(i)}
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
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="animate-spin inline-block size-12 border-[5px] border-current border-t-transparent text-red-500 rounded-full">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className="py-10 sm:py-20 border-t">
        <div className="flex justify-center text-base sm:text-2xl mb-8">
          <Title children1={"All"} children2={"Collection"} />
        </div>

        {products.length ?
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
              {products.map((product) => (
                <ProductItem
                  key={product._id}
                  id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}                  averageRating={product.averageRating}
                  totalRatings={product.totalRatings}                />
              ))}
            </div>

            {totalPages > 0 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 0 && handlePageChange(currentPage - 1)
                        }
                        className={`cursor-pointer ${currentPage === 0 ? "pointer-events-none opacity-50" : ""}`}
                      />
                    </PaginationItem>

                    {renderPageNumbers()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                        className={`cursor-pointer ${
                          currentPage === totalPages ?
                            "pointer-events-none opacity-50"
                          : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        : <div className="w-full text-xl text-red-500 text-center min-h-[50vh] flex items-center justify-center">
            No Products Found
          </div>
        }
      </div>
    </Container>
  );
}

export default Collection;
