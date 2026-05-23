import { prisma } from "../config/db.js";

export const getDashboardAnalytics =
  async (req, res) => {
    try {

      const userId =
        req.user.userId;

      const dashboard =
        await prisma.dashboard.findUnique({
          where: {
            user_id: userId,
          },
        });

      return res.status(200).json({
        success: true,
        dashboard,
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };