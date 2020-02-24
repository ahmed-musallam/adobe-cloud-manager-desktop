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
  ICON_FILES="$ICON_FILES $ICONSET_FOLDER/$icon"
  echo Generating $icon
  convert $PNG_MASTER -quality 100 -resize $size $ICONSET_FOLDER/$icon
  
  icon="icon_${size}@2x.png"
  ICON_FILES="$ICON_FILES $ICONSET_FOLDER/$icon"
  echo Generating $icon
  convert $PNG_MASTER -quality 100 -resize $size $ICONSET_FOLDER/$icon
done


iconutil -c icns $ICONSET_FOLDER -o icon.icns
ICON_FILES=""
for size in "${sizes[@]}"; do
  ICON_FILES="$ICON_FILES $ICONSET_FOLDER/icon_${size}.png"
  ICON_FILES="$ICON_FILES $ICONSET_FOLDER/icon_${size}@2x.png"
done
echo Generating icon.ico
convert $ICON_FILES icon.ico
rm -rf $ICONSET_FOLDER