import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const {
    videoUrl,
    title,
    city,
    instrument,
    experience,
    age,
    month,
    year,
    address,
    phone,
    organization,
    myhandles,
    genre,
    djGenre,
    djEquipment,
    mcType,
    mcLanguages,
    talentbio,
    isMusician,
    isClient,
  } = await req.json();
  console.log(month);
  if (!age || !month || !year) {
    return NextResponse.json({
      updateStatus: false,
      message: "Date ,Month and year are required",
    });
  } else if (!city) {
    return NextResponse.json({
      updateStatus: false,
      message: "City is required",
    });
  } else {
    console.log("city", city);
    console.log("year", year);
    console.log("month", month);
    console.log("age", age);
    console.log("experience", experience);
    console.log("instrument", instrument);
    try {
      await connectDb();
      const user = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            instrument,
            experience,
            date: age,
            month,
            year,
            city,
            address,
            phone,
            organization,
            musicianhandles: myhandles,
            musiciangenres: genre,
            djGenre,
            djEquipment,
            mcType,
            mcLanguages,
            talentbio,
            isMusician: isClient === true ? false : true,
            isClient: isMusician === true ? false : true,
          },
          $push: {
            videosProfile: {
              url: videoUrl,
              title,
              createdAt: new Date(),
            },
          },
        }
      );
      return NextResponse.json({
        updateStatus: true,
        message: "Update successfull",
        userData: user,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        updateStatus: false,
        message: error,
      });
    }
  }
}
