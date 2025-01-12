export const getTimeFromISOString = (value: string | undefined): string => {
	if (value === undefined || value === null) return "None";
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Ho_Chi_Minh", // Múi giờ Việt Nam
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		weekday: "long",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
	const date: Date = new Date(value);
	return formatter.format(date);
};
