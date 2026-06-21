interface Props {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ rating, max = 5, size = "md" }: Props) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-xl" };
  return (
    <span className={`${sizes[size]} leading-none`} aria-label={`${rating} из ${max} звёзд`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? "star-active" : "star-inactive"}>★</span>
      ))}
    </span>
  );
}
