import { prisma } from "../../config/db.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";
import { redis } from "../../config/redis.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        headline: true,
        resume: true,

        users_links: true,
        skills: true,
        is_public: true,
        is_active: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateCurrentUser = async (req, res) => {
  try {
    const {
      name,
      username,
      bio,
      headline,

      is_public,
      users_links,
      skills,
      remove_avatar,
      remove_resume,
    } = req.body;

    // With upload.fields(), files arrive under req.files[field] as arrays.
    const avatarFile = req.files?.avatar?.[0];
    const resumeFile = req.files?.resume?.[0];

    let avatarUrl = undefined;
    if (avatarFile) {
      const uploadedImage = await uploadToCloudinary(avatarFile.buffer, "avatars");
      avatarUrl = uploadedImage.secure_url;
    } else if (remove_avatar === "true" || remove_avatar === true) {
      // Explicit request to clear the saved avatar.
      avatarUrl = null;
    }

    let resumeUrl = undefined;
    if (resumeFile) {
      // PDFs upload as "raw" resources on Cloudinary.
      const uploadedResume = await uploadToCloudinary(
        resumeFile.buffer,
        "resumes",
        "raw"
      );
      resumeUrl = uploadedResume.secure_url;
    } else if (remove_resume === "true" || remove_resume === true) {
      resumeUrl = null;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username }),
        ...(bio !== undefined && { bio }),
        ...(headline !== undefined && { headline }),

        ...(avatarUrl !== undefined && { avatar: avatarUrl }),
        ...(resumeUrl !== undefined && { resume: resumeUrl }),
        ...(is_public !== undefined && {
          is_public: is_public === "true" || is_public === true,
        }),
        ...(users_links !== undefined && {
          users_links:
            typeof users_links === "string"
              ? JSON.parse(users_links)
              : users_links,
        }),
        ...(skills !== undefined && {
          skills:
            typeof skills === "string" ? JSON.parse(skills) : skills,
        }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        headline: true,
        resume: true,

        users_links: true,
        skills: true,
        is_public: true,
        is_active: true,
        created_at: true,
      },
    });

    await redis.del(`portfolio:${req.user.userId}`);

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);

    // Prisma unique constraint violation code
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
