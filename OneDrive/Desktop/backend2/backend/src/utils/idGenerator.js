const generateId = async (prefix, Model, fieldName = 'trackingId') => {
    try {
        const date = new Date();
        const year = date.getFullYear();

        // Count documents created this year (for complaints) or all time (for users/departments)
        let query = {};
        let formattedYear = '';

        if (prefix === 'CMP') {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59);
            query = { createdAt: { $gte: startOfYear, $lte: endOfYear } };
            formattedYear = `-${year}`;
        }

        const count = await Model.countDocuments(query);
        const nextNumber = count + 1;

        // Pad the number with zeros (e.g., 00001, 00015)
        const paddedNumber = String(nextNumber).padStart(5, '0');

        return `${prefix}${formattedYear}-${paddedNumber}`;
    } catch (error) {
        console.error(`Error generating ID for ${prefix}:`, error);
        throw new Error('Could not generate unique ID');
    }
};

export default generateId;
