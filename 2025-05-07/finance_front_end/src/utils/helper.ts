
export const base_url = "http://152.70.66.210:8000";
// export const base_url = "http://192.168.1.112:8000";

export const getLocalDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-CA"); // ✅ Keeps date in IST and formats YYYY-MM-DD
  };
  
