for file in `ls | grep -E "GZK|Lib"` 
do
  if [ -d $file ]
  then
    cd $file
    cp ../.gitignore .
    grep -Ev "^$|^[#;]" .gitignore | xargs git rm --ignore-unmatch --cached -r
    cd ..
  fi
done
