PNG_MASTER="icon-large.png"
ICONSET_FOLDER="AppIcon.iconset"
sizes=(
  16x16
  32x32
  128x128
  256x256
  512x512
)

mkdir -p $ICONSET_FOLDER

for size in "${sizes[@]}"; do
  icon="icon_${size}.png"
  echo Generating $icon
  convert $PNG_MASTER -quality 100 -resize $size $ICONSET_FOLDER/$icon
  
  icon="icon_${size}@2x.png"
  echo Generating $icon
  convert $PNG_MASTER -quality 100 -resize $size $ICONSET_FOLDER/$icon
done

iconutil -c icns $ICONSET_FOLDER -o icon.icns
rm -rf $ICONSET_FOLDER