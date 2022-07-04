

export const formatWithCommas = (x: number | null) => x==null ? "" : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
