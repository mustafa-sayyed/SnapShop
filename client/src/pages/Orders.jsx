import React, { useEffect, useState } from "react";
import { useShop } from "../contexts/ShopContext";
import { Container, Title, StarRating, ReviewModal } from "../components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CreditCard, MessageSquare } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

function Orders() {
  const { currency } = useShop();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [productRatings, setProductRatings] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    (async () => {
      if (token) {
        try {
          const response = await axios.get(`${backendUrl}/orders/myorders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setOrderItems(response.data.orders.reverse());

            const ratings = {};
            for (const order of response.data.orders) {
              for (const item of order.items) {
                const existingRating = item.ratings?.find(
                  (r) =>
                    String(r.orderId) === String(order._id) &&
                    String(r.userId) === String(order.userId),
                );
                if (existingRating) {
                  ratings[`${order._id}-${item._id}`] = existingRating;
                }
              }
            }
            setProductRatings(ratings);
          }
        } catch (error) {
          console.log(error);
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error(`Internal Server Error`);
          }
        } finally {
          setLoading(false);
        }
      }
    })();
  }, []);

  const handleRateProduct = (item, orderId, currentRating = 0) => {
    if (currentRating > 0) {
      setSelectedProduct(item);
      setSelectedOrderId(orderId);
      setReviewModalOpen(true);
    } else {
      setSelectedProduct(item);
      setSelectedOrderId(orderId);
    }
  };

  const handleStarClick = async (rating, item, orderId) => {
    try {
      setIsSubmittingReview(true);
      const response = await axios.post(
        `${backendUrl}/products/rating`,
        {
          productId: item._id,
          orderId: orderId,
          rating: rating,
          review: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Rating submitted! Now write a review.");
        setProductRatings({
          ...productRatings,
          [`${orderId}-${item._id}`]: { rating, review: "" },
        });
        setSelectedProduct(item);
        setSelectedOrderId(orderId);
        setReviewModalOpen(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSubmitReview = async ({ rating, review }) => {
    try {
      setIsSubmittingReview(true);
      const response = await axios.post(
        `${backendUrl}/products/rating`,
        {
          productId: selectedProduct._id,
          orderId: selectedOrderId,
          rating: rating,
          review: review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setProductRatings({
          ...productRatings,
          [`${selectedOrderId}-${selectedProduct._id}`]: { rating, review },
        });
        setReviewModalOpen(false);
        setSelectedProduct(null);
        setSelectedOrderId(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      failed: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <Badge className={`${variants[status] || variants.pending} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const variants = {
      pending: "bg-orange-100 text-orange-800 border-orange-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      failed: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <Badge className={`${variants[paymentStatus] || variants.pending} border`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {paymentStatus === "completed" ?
          "Paid"
        : paymentStatus === "failed" ?
          "Failed"
        : "Pending"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[85vh]">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <Container>
      <div className="border-t pt-16 min-h-screen pb-10">
        <div className="text-2xl mb-8">
          <Title children1={"My"} children2={"Orders"} />
        </div>

        <div className="space-y-6">
          {orderItems.length ?
            orderItems.map((order, index) => (
              <Card key={index} className="p-6 transition-shadow">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-start items-center gap-2 border-b pb-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-lg flex items-center gap-2">
                        <span>Order Status: {getStatusBadge(order.status)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => {
                      const ratingKey = `${order._id}-${item._id}`;
                      const currentRating = productRatings[ratingKey];

                      return (
                        <div
                          key={itemIndex}
                          className="flex gap-4 items-start border-b pb-4 last:border-b-0"
                        >
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                              <span className="font-semibold text-lg text-gray-900">
                                {currency}
                                {item.price}
                              </span>
                              <span>Qty: {item.quantity}</span>
                              <span>Size: {item.size}</span>
                            </div>

                            {order.status === "delivered" && (
                              <div className="mt-3">
                                {currentRating ?
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <StarRating rating={currentRating.rating} />
                                      {!currentRating.review && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleRateProduct(
                                              item,
                                              order._id,
                                              currentRating.rating,
                                            )
                                          }
                                          className="ml-2"
                                        >
                                          <MessageSquare className="w-3 h-3 mr-1" />
                                          <span>Write Review</span>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                : <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                      Rate this product:
                                    </span>
                                    <StarRating
                                      rating={0}
                                      interactive={true}
                                      onRatingChange={(rating) =>
                                        handleStarClick(rating, item, order._id)
                                      }
                                    />
                                  </div>
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div className="space-y-1 flex flex-col text-sm">
                      <p className="">
                        Payment Method:{" "}
                        <span className="font-medium text-gray-900">
                          {order.paymentMethod}
                        </span>
                      </p>
                      <p>Payment Status: {getPaymentStatusBadge(order.paymentStatus)}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Total: {currency}
                        {order.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          : <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center">
              <Package className="w-20 h-20 text-gray-300" />
              <div className="text-center text-3xl font-semibold text-gray-700">
                No Orders Yet
              </div>
              <p className="text-gray-500">Start shopping to see your orders here</p>
              <button
                className="mt-4 px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => navigate("/collection")}
              >
                Continue Shopping
              </button>
            </div>
          }
        </div>
      </div>

      {selectedProduct && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProduct(null);
            setSelectedOrderId(null);
          }}
          productName={selectedProduct.name}
          productImage={selectedProduct.image[0]}
          initialRating={
            productRatings[`${selectedOrderId}-${selectedProduct._id}`]?.rating || 0
          }
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmittingReview}
        />
      )}
    </Container>
  );
}

export default Orders;
