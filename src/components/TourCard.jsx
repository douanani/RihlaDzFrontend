import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Skeleton from "@mui/material/Skeleton";

const TourCard = ({ tour, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check favorite status with SWR caching
  const {
    data: isFavorite,
    isLoading: isFavoriteStatusLoading,
    isFetching: isFavoriteStatusFetching,
  } = useQuery({
    queryKey: ["favorites", tour.id],
    queryFn: async () => {
      if (!user) return false;
      try {
        const response = await api.get("/api/favorites/check", {
          params: { tour_id: tour.id },
        });
        return response.data.isFavorite;
      } catch (error) {
        console.error("Error checking favorite status:", error);
        return false;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes stale time
    cacheTime: 1000 * 60 * 60, // 1 hour cache time
    refetchOnWindowFocus: false,
  });

  // Toggle favorite mutation with optimistic updates
  const { mutate: toggleFavorite, isLoading: isFavoriteLoading } = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await api.delete(`/api/favorites/${tour.id}`);
      } else {
        await api.post("/api/favorites", { tour_id: tour.id });
      }
    },
    onMutate: async () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["favorites", tour.id]);

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(["favorites", tour.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(["favorites", tour.id], !isFavorite);

      // Return a context object with the snapshotted value
      return { previousStatus };
    },
    onError: (err, _, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(["favorites", tour.id], context.previousStatus);
      console.error("Error toggling favorite:", err);
      if (err.response?.status === 401) {
        alert("Please login to add to favorites");
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries(["favorites", tour.id]);
    },
  });

  const handleBookNow = () => {
    if (!user) {
      alert("Please login to book a tour");
      return;
    }
    alert("Booking feature coming soon!");
  };

  return (
    <motion.div
      className="col-lg-4 col-md-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="package-item border rounded-4 overflow-hidden shadow-sm bg-white d-flex flex-column position-relative"
        style={{
          height: "480px",
          maxWidth: "100%",
        }}
      >
        {/* Favorite Button - only show if user is authenticated */}
        {user && (
          <motion.button
            onClick={() => toggleFavorite()}
            className="position-absolute top-0 end-0 border-0 bg-transparent"
            style={{
              zIndex: 10,
              padding: "12px",
              fontSize: "1.5rem",
              lineHeight: 1,
              cursor:
                isFavoriteLoading || isFavoriteStatusLoading
                  ? "wait"
                  : "pointer",
            }}
            disabled={isFavoriteLoading || isFavoriteStatusLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              transition: { type: "spring", stiffness: 500 },
            }}
          >
            {isFavoriteLoading || isFavoriteStatusLoading ? (
              <motion.i
                className="fas fa-spinner fa-spin"
                style={{ color: "#86B817" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : isFavorite ? (
              <motion.i
                className="fas fa-heart"
                initial={{ scale: 0.8 }}
                animate={{
                  scale: 1,
                  color: "#ff4081",
                  textShadow: "0 0 8px rgba(255, 64, 129, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 500 }}
              />
            ) : (
              <motion.i
                className="far fa-heart"
                animate={{
                  color: isHovered ? "#ff4081" : "white",
                  textShadow: isHovered
                    ? "0 0 8px rgba(255, 64, 129, 0.5)"
                    : "0 0 3px rgba(0,0,0,0.8)",
                }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        )}

        {/* Header with title */}
        <div
          className="text-center text-white py-2"
          style={{ backgroundColor: "#86B817" }}
        >
          <h5 className="mb-0 text-truncate">{tour.title}</h5>
        </div>

        {/* Image section with skeleton loader */}
        <div className="overflow-hidden text-center position-relative">
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              animation="wave"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "#f5f5f5",
              }}
            />
          )}
          <img
            className="img-fluid"
            src={`http://localhost:8000/storage/${tour.thumbnail}`}
            alt={tour.title}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderBottom: "1px solid #ddd",
              display: imageLoaded ? "block" : "none",
            }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "/placeholder-tour.jpg";
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        </div>

        {/* Tour details */}
        <div className="d-flex border-bottom bg-light">
          <small className="flex-fill text-center border-end py-2">
            <i className="fa fa-map-marker-alt text-primary me-2" />
            {tour.location}
          </small>
          <small className="flex-fill text-center border-end py-2">
            <i className="fa fa-calendar-alt text-primary me-2" />
            {tour.duration} days
          </small>
          <small className="flex-fill text-center py-2">
            <i className="fa fa-user text-primary me-2" />
            {tour.max_people} Person
          </small>
        </div>

        {/* Description and actions */}
        <div className="text-center p-3 d-flex flex-column justify-content-between flex-grow-1">
          <div>
            <h3 className="mb-0 text-primary">{tour.price} DA</h3>
          <div className="mb-2">
  {[...Array(5)].map((_, i) => {
    const ratingValue = i + 1;
    return (
      <small
        key={i}
        className={`fa ${
          ratingValue <= tour.rating
            ? "fa-star text-warning"
            : ratingValue - 0.5 <= tour.rating
              ? "fa-star-half-alt text-warning"
              : "fa-star text-secondary"
        }`}
      />
    );
  })}
  <small className="ms-1">
    ({tour.reviews_count || 0} reviews)
  </small>
</div>
            <p className="text-muted small" style={{ minHeight: "60px" }}>
              {tour.description?.slice(0, 100)}...
            </p>
          </div>
          <div className="d-flex justify-content-center mb-1">
            <Link
              to={`/tourDetails/${tour.id}`}
              className="btn btn-outline-primary btn-sm px-3 border-end"
              style={{ borderRadius: "30px 0 0 30px" }}
            >
              Read More
            </Link>
            <button
              className="btn btn-primary btn-sm px-3"
              style={{ borderRadius: "0 30px 30px 0" }}
              onClick={handleBookNow}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
