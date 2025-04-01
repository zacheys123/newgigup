import connectDb from "@/lib/connectDb";
import Gig from "@/models/gigs";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // Extract the `id` from the URL path

  const {
    firstname,
    lastname,
    email,
    username,
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
    clienthandles,
    isMusician,
    isClient,
  } = await req.json();
  console.log(isMusician);
  console.log("client", isClient);
  if (isMusician === true && !age) {
    return NextResponse.json({
      updateStatus: false,
      message: "Date is required",
    });
  } else if (isMusician === true && !month) {
    return NextResponse.json({
      updateStatus: false,
      message: " Month  is required",
    });
  } else if (isMusician === true && !year) {
    return NextResponse.json({
      updateStatus: false,
      message: "  Year is required",
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
      await Gig.updateMany(
        {
          bookCount: id,
          bookedBy: { $ne: id }, // Ensures id is NOT in bookedBy
        },
        { $pull: { bookCount: id } }
      );
      const user = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            firstname,
            lastname,
            email,
            username,
            instrument: isClient ? "" : instrument,
            experience: isClient ? "" : experience,
            date: age === isClient ? "" : age,
            month: isClient ? "" : month,
            year: isClient ? "" : instrument,
            city,
            address,
            phone,
            organization: isMusician ? "" : organization,
            musicianhandles: myhandles === isClient ? "" : myhandles,
            handles: isClient ? clienthandles : "",
            musiciangenres: genre === isClient ? "" : genre,
            djGenre: isClient ? "" : djGenre,
            djEquipment: isClient ? "" : djEquipment,
            mcType: isClient ? "" : mcType,
            mcLanguages: isClient ? "" : mcLanguages,
            talentbio,
            isMusician,
            isClient,
          },
          $push: {
            videosProfile: isClient
              ? {}
              : {
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
